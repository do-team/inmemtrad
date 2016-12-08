Random order generator, injecting orders directly to Redis database
===================================================================

This application connects to your **Redis** database and start filling it with
randomised orders. Idea is to have multiple applications like this,
simulating cross-trading of low latency algo traders.

You can start application locally, from **Lambda**, from **Docker** container. You
have to set environmental variable *IMTCONNECT* to one of three options:
LOCALHOST
SOCKET
INTERNET

In most cases, it would be `LOCALHOST` or `INTERNET`, only in case you run
application directly on the Redis machine, you can connect directly to
unix socket (`/tmp/redis.sock` by default).

Amount of randomly generated orders depends on variable `cycles`.

Result is basically a *no-latency* trading, you cannot get much faster,
than this...