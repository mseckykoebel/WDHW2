from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

from views import get_authorized_user_ids

import flask_jwt_extended


def get_path():
    return request.host_url + "api/posts/"


class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        """
        People who the current user is following.
        Select user_id where follow
        """
        user_ids = get_authorized_user_ids(self.current_user)
        user_ids = [id for id in user_ids if id != self.current_user.id]

        print(f"User IDs: {len(user_ids)}")

        # get all of the information from a list of userIds
        users = User.query.filter(User.id.in_(user_ids)).all()
        users_json = []
        for user in users:
            users_json.append({"id": self.current_user.id, "following": user.to_dict()})

        return Response(json.dumps(users_json), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "following" record based on the data posted in the body
        body = request.get_json()
        print(f"BODY: {body}")

        # try to cast to an int, and if it fails, error it out
        try:
            user_id = int(body.get("user_id"))
        except:
            return Response(
                json.dumps({"message": "user ID must be an integer"}),
                mimetype="application/json",
                status=400,
            )

        user = User.query.get(user_id)
        if not user:
            return Response(
                json.dumps({"message": "invalid user ID"}),
                mimetype="application/json",
                status=404,
            )

        try:
            new_following = Following(self.current_user.id, user_id)
            print(f"New following: {new_following}")
            db.session.add(new_following)
            db.session.commit()

            return Response(
                json.dumps(new_following.to_dict_following()),
                mimetype="application/json",
                status=201,
            )

        except:
            return Response(
                json.dumps({"message": "Error following user"}),
                mimetype="application/json",
                status=400,
            )


class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "following" record where "id"=id
        if id > 999:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # see if we are authorized to edit this bookmark
        following = Following.query.get(id)
        user_ids = get_authorized_user_ids(self.current_user)
        if following.following_id not in user_ids:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # delete following where "id"=id
        Following.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(
            json.dumps(
                {"message": "following id={0} was successfully deleted".format(id)}
            ),
            mimetype="application/json",
            status=200,
        )


def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint,
        "/api/following",
        "/api/following/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
    api.add_resource(
        FollowingDetailEndpoint,
        "/api/following/<int:id>",
        "/api/following/<int:id>/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
