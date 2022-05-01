from flask import Response, request
from flask_restful import Resource
from models import User, Following, db
from views import get_authorized_user_ids
import json


class SuggestionsListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        Suggestions for seven users that we're not following.
        Hard-coded limit to seven
        """
        user_ids_tuples = (
            db.session.query(Following.following_id)
            .filter(
                Following.user_id != self.current_user.id and Following.following_id != 12
            )
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
            users_json.append({"id": self.current_user.id, "suggested user": user.to_dict()})

        return Response(json.dumps(users_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint,
        "/api/suggestions",
        "/api/suggestions/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
