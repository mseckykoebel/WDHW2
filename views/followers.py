from flask import Response, request
from flask_restful import Resource
from models import db, Following, User
import json


def get_path():
    return request.host_url + "api/posts/"


class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        """
        # query that finds all the users that are following the logged in user
        user_ids_tuples = (
            db.session.query(Following.user_id)
            .filter(Following.following_id == self.current_user.id)
            .order_by(Following.user_id)
            .all()
        )

        user_ids = [id for (id,) in user_ids_tuples]

        # get the user info from the userIDs
        users = User.query.filter(User.id.in_(user_ids)).all()
        users_json = []
        for user in users:
            users_json.append({"id": self.current_user.id, "follower": user.to_dict()})

        # return the response
        return Response(json.dumps(users_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint,
        "/api/followers",
        "/api/followers/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
