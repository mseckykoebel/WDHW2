# Lecture 17 notes

## WHAT DO DO TO LOCK DOWN THE API (PART ONE):

- deprecate the usage of user number 12
- add a decorator to the top of any API endpoint that we want to require a JWT token. make sure to add this to every endpoint

## WHAT TO DO TO TO ALSO LOCK DOWN THE API (part three)

- include something with CRF
- model this after the API docs does it
- need to grab this from the cookie

## WHEN ALL DONE

- delete the two lines of code in `app.py` (with app current context)