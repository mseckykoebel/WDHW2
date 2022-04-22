# What is the value of SQLAlchemy?
It is a python abstraction on top of python that allows you to basically write python code to query SQL databases. It works with all flavors of SQL (MYSQL, SQLite, etc.). This saves you from needing to write SQL queries and then figure out how to "get it to work" with python and flask.

# What is a model?
A model lays out how a python class relates to some sql database table. This is that abstraction from above - you interact with SQLAlchemy "models" instead of tabels, which are python classes that map to SQL tables. SQLAlchemy does the translation.

# What is a view?
A view is a 'virtual' SQL table that contains the results of some query, or the results of performing some action. It is designed to be static and used as-is (no further modificaiton). Helps with visualizing the results of something complicated, and to be used a lot. 