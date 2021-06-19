# Rotazioni: a linear programming workout split optimizer

![Application screenshot](client/public/rotazioni.png)

## Dependencies
Dependencies for the frontend and backend are respectively listed in `client/package.json` and `api/requirements.txt`.\
A self-contained docker installation is provided.

## Deployment (Docker)
Make sure you have a docker service running on your machine.\
Then run `./build_prod.sh && ./deploy_prod.sh` to create and launch the docker container. The backend will be listening port 5000,
while the frontend will be available through port 80.

## Pull Requests
If you want to contribute to the project, you can do so by solving one of the many open issues or by creating new ones.\
When proposing a pull request, make sure you do so on the `production` branch, so that when merged, the change will trigger the CI/CD pipeline.

## Notes on localization
Rotazioni has been developed for an italian public, since it solves a very specific problem only found in a very specific italian community. Therefore there are currently no plans of internationalizing the product. Neverthless, if anyone wants to translate it and provide an easy internationalization setup, he's welcome to do it. 
