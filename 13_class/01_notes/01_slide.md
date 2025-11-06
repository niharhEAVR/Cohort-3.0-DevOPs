### Todays class slide link:

```link
https://projects.100xdevs.com/tracks/monitoring-1/Monitoring--Logging-and-Newrelic-1
```


---


### Steps of todays class

1. Crete a virtual machine from either AWS instances or DigitalOcean Droplets, then ssh into it
2. now log into newrelic, (First time log in will give you lot of options, just dont select any options right now and refresh the page )
3. now click to the `Integrations & Agents` section from the side bar,choose the `Docker` from `popular` section

4. `Enter your user key` from here choose `Create a new key`, copy the key and put it into `.env` file and click continue

5. `Select an installation method` from here choose the `Basic` then `Select docker network` from here choose the `Default Host` (besaue we want newrelic to talk to the server) and click continue

6. `Install the New Relic infrastructure agent` from here copy the command and edit it slight (because we have to make it `sudo`)
    - Your command should something looks like this and click continue

```sh
sudo docker run \
  --detach \
  --name newrelic-infra \
  --network=host \
  --cap-add=SYS_PTRACE \
  --privileged \
  --pid=host \
  --volume "/:/host:ro" \
  --volume "/var/run/docker.sock:/var/run/docker.sock" \
  --volume "newrelic-infra:/etc/newrelic-infra" \
  --env NRIA_LICENSE_KEY=*************************** \
  newrelic/infrastructure:latest
```


7. `Test the connection` from here when the docker finally runs the newrelic image after that click on the `Test connection` and you will see a `Infrastructure Agent | succesfull` status and click `See your data`


---


# Restart the class from 27:46