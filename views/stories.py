from flask import Response
from flask_restful import Resource
from models import Story
from models import Following, Story, db
from views import get_authorized_user_ids
import json


class StoriesListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        # get stories created by one of these users:
        # print(get_authorized_user_ids(self.current_user))
        user_ids_tuples = (
            db.session.query(Following.following_id)
            .filter(Following.user_id == self.current_user.id)
            .order_by(Following.following_id)
            .all()
        )
        print(f"User IDs: {user_ids_tuples}")
        user_ids = [id for (id,) in user_ids_tuples]

        # get all of the information from a list of userIds
        user_stories = Story.query.filter(Story.id.in_(user_ids)).all()
        print(f"users: {user_stories}")
        users_json = []
        for user in user_stories:
            users_json.append(user.to_dict())

        return Response(json.dumps(users_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        StoriesListEndpoint,
        "/api/stories",
        "/api/stories/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
