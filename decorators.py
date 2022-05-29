import flask_jwt_extended
from flask import redirect

# view function is the route
def jwt_or_login(view_function):
    def wrapper(*args, **kwargs):
        # first, see if we can verify a JWT in the request
        try:
            flask_jwt_extended.verify_jwt_in_request()
            return view_function(*args, **kwargs)
        # if there is no JWT, we must redirect
        except:
            return redirect('/login', code=302)
            
    # https://stackoverflow.com/questions/17256602/assertionerror-view-function-mapping-is-overwriting-an-existing-endpoint-functi
    wrapper.__name__ = view_function.__name__
    return wrapper 