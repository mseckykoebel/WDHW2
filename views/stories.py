from flask import Response
from flask_restful import Resource
from models import Story
from models import Following, Story
from views import get_authorized_user_ids
import json


class StoriesListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        # get stories created by one of these users:
        user_ids = get_authorized_user_ids(self.current_user)
        # user_ids = [id for id in user_ids if id != self.current_user.id]

        # get all of the information from a list of userIds
        user_stories = Story.query.filter(Story.user_id.in_(user_ids)).all()
        print(f"users: {user_stories}")

        return Response(
            json.dumps([story.to_dict() for story in user_stories]),
            mimetype="application/json",
            status=200,
        )


def initialize_routes(api):
    api.add_resource(
        StoriesListEndpoint,
        "/api/stories",
        "/api/stories/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
