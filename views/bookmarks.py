from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db
import json


class BookmarksListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        Get all of the bookmarks bookmarked by the currently logged in user
        """
        bookmark_data = Bookmark.query.filter(
            Bookmark.user_id == self.current_user.id
        ).all()
        print(bookmark_data)
        bookmarks_json = [bookmark.to_dict() for bookmark in bookmark_data]

        return Response(
            json.dumps(bookmarks_json), mimetype="application/json", status=200
        )

    def post(self):
        # create a new "bookmark" based on the data posted in the body
        body = request.get_json()
        print(body)
        return Response(json.dumps({}), mimetype="application/json", status=201)


class BookmarkDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def delete(self, id):
        # delete "bookmark" record where "id"=id
        print(id)
        return Response(json.dumps({}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint,
        "/api/bookmarks",
        "/api/bookmarks/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )

    api.add_resource(
        BookmarkDetailEndpoint,
        "/api/bookmarks/<int:id>",
        "/api/bookmarks/<int:id>",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
