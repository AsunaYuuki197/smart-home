# Install PyTorch (If you want to use the integrated AI)

Depending on your os, Please visit this page [https://pytorch.org/get-started/locally/] and follow the steps to download PyTorch with the CUDA 12.4 compute platform. 

# Install Docker (If you want to use redis locally)

Depending on your os, Please visit this page [https://docs.docker.com/get-started/get-docker/] and follow the steps to download Docker.

Uncomment run_redis() in server.py 

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


