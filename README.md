# Docker-NodeJS Development Boilerplate

**This is a boilerplate to demonstrate containerized development in NodeJS using Docker.**

#### Stack
- Containerized using **[Docker](https://www.docker.com/)**.
- Uses **[Nginx](http://nginx.org/)** container to proxy http 80 port to a **[NodeJS](https://nodejs.org/)** server running on port 3000.
- Package management using **NPM** and **[Bower](http://bower.io/)**.
- Sets up **[MongoDB](https://www.mongodb.org/)** container.
- Watching for changes using **[Nodemon](http://nodemon.io/)** and **[LiveReload](http://livereload.com/)**.
- Builds and starts the app using **[Gulp](http://gulpjs.com/)** task runner.
- Everything is orchestrated using **[Docker-Compose](http://docs.docker.com/compose/)**

#### Reasoning
Learning how to setup all this for Docker required quite a bit of reading and most of the guides you find are for production deployment, while I was more interested in using Docker for development setup.

It's very convenient to be able to get development environment running quickly and easily in very different platforms (OSX/Linux/Windows). Docker is perfect for this.

Especially differences between production and development configurations for `node_modules` and `bower_components` was hard to understand: while in production you might want these "layers" to be cached until you actually change something from `package.json` or `bower.json`, in development you want to have them readily available.

It's also worth nothing that running `gulp` or `bower install` directly requires you to install those globally (`npm i gulp bower -g`), but when run via NPM (see scripts section from `package.json`), it uses versions installed to `node_modules`.

## Installing

##### 1. Install prerequisites
* Install [Docker](https://www.docker.com/) on your system.
* Install [Docker Compose](http://docs.docker.com/compose/) on your system.

##### 2. Configure `/etc/hosts` file

Check what is your Docker machine's name by running `docker-machine ls` — often it's `default`.

Then run this one-liner — just replace `default` with your machine name, if it differs:
```bash
printf "\n\n$(docker-machine ip default)\\tapp.dev" | sudo tee -a /etc/hosts > /dev/null
```

This will add these lines to your `/etc/hosts` file and it will ask for sudo password:

```
[DOCKER-MACHINE-IP]	app.dev
```

> Tip: If you would like to skip Nginx, you can access NodeJS directly with `http://[DOCKER-MACHINE-IP]:3000/`
> If you're OSX user, you need to follow [these instructions for OSX](https://labs.ctl.io/tutorials/docker-on-the-mac-without-boot2docker/) (not required on Linux).

##### 3. Build and start containers

Run `docker-compose up`

The build script will:
- Download Nginx, NodeJS and MongoDB containers
- Install NPM modules
- Install Bower components
- Launch Gulp task runner which in turn will compile frontend assets and start serving the app

##### 4. Hack!

Open [http://app.dev/](http://app.dev/)

Now go ahead and do changes to `./src/app.scss` or `./public/index.html` and see this page reload changes.

#### Running & upgrading

- Hit `Ctrl+C` to turn off containers.
- Type `docker-compose up` to start them up again. You might want to run containers as daemon: `docker-compose up -d` and then attach to Node container to see the logs: `docker-compose logs app`. Otherwise you'll see logs from all the containers.
- To update NPM and Bower modules, run: `docker-compose run app npm update`

## Running without Docker
1. Install NodeJS and MongoDB. Make sure MongoDB is running in localhost at default port.
2. Run `npm start`
3. Open [http://localhost:3000/](http://localhost:3000/)

This will skip Nginx proxy setup.

## Running in production
This boilerplate doesn't currently include production configuration, but you could serve the application using Docker.

To serve in production without Docker, building the assets first (`npm build`) and then serve `server.js` using e.g. **Nginx** proxy together with app runner such as **[Phusion Passenger](phusionpassenger.com)**, **[PM2](https://www.npmjs.com/package/pm2)** or **Forever**.

It's important to understand that Docker-Compose configuration (`docker-compose.yml`) is meant for running this in development and in production you would use only `Dockerfile` configuration.

## Security notes
Since this boilerplate is meant mainly for development, it doesn't have security measures configured for the app or Docker containers. Included app (`server.js`) is a very simple barebone hello-world example.

Note that it's recommended not to have `bower_components` folder publicly accessible — use Gulp to compile exactly what you need from the folder.

## File structure
- `config`: Nginx configuration files for `location` and `server` configuration blocks. These basically turn Nginx caching off to make development easier.
- `docker-compose.yml`, `Dockerfile` and `.dockerignore`: Configurations for Docker containers.
- `node_modules`: Backend modules
- `bower_components`: Frontend vendor assets
- `public`: Folder served by NodeJS server.
- `public/build`: Compiled frontend assets
- `src`: files to be compiled to `public/build`
- `gulpfile.js`: Gulp task runner configuration
- `.editorconfig`: [EditorConfig](http://editorconfig.org/) is awesome
- `bower.json` and `.bowerrc`: configurations and requirements for frontend vendor assets
- `package.json`: scripts and NPM requirements for this app
- `server.js`: Application entry point
- `.gitignore`: [Gitignore](https://github.com/github/gitignore)

## Reading
- [Docker for development - common problems and solutions](https://medium.com/@rdsubhas/docker-for-development-common-problems-and-solutions-95b25cae41eb)

## License
MIT
