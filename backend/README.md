# Install PyTorch (If you want to use the integrated AI)

Depending on your os, Please visit this page [https://pytorch.org/get-started/locally/] and follow the steps to download PyTorch with the CUDA 12.4 compute platform. 

# Set up Redis
## Install Docker (If you want to use redis locally)

1. Depending on your os, Please visit this page [https://docs.docker.com/get-started/get-docker/] and follow the steps to download Docker.

2. Uncomment run_redis() in server.py 

## Using cloud.redis.io or Any cloud platform support Redis

1. Create the Redis database by following [This Redis link](https://redis.io/docs/latest/operate/rc/rc-quickstart/)

2. Add to .env file (in smart-home folder)

```shell
Redis_HOST = "your redis endpoint"
Redis_PORT = "your redis endpoint port"
Redis_PW = "your redis user password"
```

# Install dependencies

```
  pip install -r requirements.txt
```

# Fix issues if you encounter

1. OSError: We couldn't connect to 'https://huggingface.co'

Try this:

```
export HF_ENDPOINT=https://hf-mirror.com
``` 

Or look at this [https://github.com/huggingface/diffusers/issues/6223]


