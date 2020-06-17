# Dating App

Run a postgres container through docker using the below command

    sudo docker run -p 5432:5432 --name pg postgres

If you want to map the container port to some different port then you can do so.

## Description of Routes

    GET     /api/users              - gets the users to be displayed
    POST    /api/user/login         - login route
    POST    /api/user/register      - register route
    DELETE  /api/user               - block a user
    PUT     /api/user               - like a user
