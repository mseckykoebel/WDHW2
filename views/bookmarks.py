from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db
import json
from tests.utils import get_authorized_user_ids

# custom import
from views import can_view_post
# flask extended
import flask_jwt_extended


class BookmarksListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
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

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "bookmark" based on the data posted in the body
        body = request.get_json()
        print(body)

        # try to cast to an int, and if it fails, error it out
        try:
            bookmark_id = int(body.get("post_id"))
        except:
            return Response(
                json.dumps({"message": "post ID must be an integer!"}),
                mimetype="application/json",
                status=400,
            )

        bookmark = Bookmark.query.get(bookmark_id)
        if not bookmark:
            return Response(
                json.dumps({"message": "invalid bookmark ID!"}),
                mimetype="application/json",
                status=404,
            )

        # check and see if we're authorized to bookmark this post
        # and, check and see if this ID is valid (cannot be too big)
        print(f"Can the user view? {can_view_post(bookmark_id, self.current_user)}")
        if not can_view_post(bookmark_id, self.current_user):
            print("Cannot access this!")
            return Response(
                json.dumps({"message": "invalid post ID"}),
                mimetype="application/json",
                status=404,
            )

        try:

            # make the new bookmark
            new_bookmark = Bookmark(self.current_user.id, bookmark_id)

            db.session.add(new_bookmark)
            db.session.commit()

            return Response(
                json.dumps(new_bookmark.to_dict()),
                mimetype="application/json",
                status=201,
            )

        except:
            return Response(
                json.dumps(
                    {
                        "message": "invalid bookmark ID - failed to create new bookmarked record"
                    }
                ),
                mimetype="application/json",
                status=400,
            )


class BookmarkDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # check if the ID is invalid
        if id > 999:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # see if we are authorized to edit this bookmark
        bookmark = Bookmark.query.get(id)
        print(f"This is the bookmark: {bookmark}")
        user_ids = get_authorized_user_ids(self.current_user.id)
        if bookmark.user_id not in user_ids:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # delete bookmark where "id"=id
        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(
            json.dumps(
                {"message": "bookmark id={0} was successfully deleted".format(id)}
            ),
            mimetype="application/json",
            status=200,
        )


def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint,
        "/api/bookmarks",
        "/api/bookmarks/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )

    api.add_resource(
        BookmarkDetailEndpoint,
        "/api/bookmarks/<int:id>",
        "/api/bookmarks/<int:id>",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
