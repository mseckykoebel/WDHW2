from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json


def get_path():
    return request.host_url + "api/posts/"


class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        People who the current user is following.
        Select user_id where follow
        """
        user_ids_tuples = (
            db.session.query(Following.following_id)
            .filter(Following.user_id == self.current_user.id)
            .order_by(Following.following_id)
            .all()
        )
        print(f"User IDs: {user_ids_tuples}")
        user_ids = [id for (id,) in user_ids_tuples]

        # get all of the information from a list of userIds
        users = User.query.filter(User.id.in_(user_ids)).all()
        print(f"users: {users}")
        users_json = []
        for user in users:
            users_json.append({"id": self.current_user.id, "follower": user.to_dict()})

        return Response(json.dumps(users_json), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body
        body = request.get_json()
        print(body)
        return Response(json.dumps({}), mimetype="application/json", status=201)


class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        return Response(json.dumps({}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint,
        "/api/following",
        "/api/following/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
    api.add_resource(
        FollowingDetailEndpoint,
        "/api/following/<int:id>",
        "/api/following/<int:id>/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
