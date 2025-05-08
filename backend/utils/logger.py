import sys
import logging

from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from logging.handlers import RotatingFileHandler
from config.logging_cfg import LoggingConfig

class Logger:
    def __init__(self, name="", log_level=logging.INFO, log_file=None) -> None:
        self.log = logging.getLogger(name)
        self.get_logger(log_level, log_file)

    def get_logger(self, log_level, log_file):
        self.log.setLevel(log_level)
        self._init_formatter()
        if log_file is not None:
            self._add_file_hander(LoggingConfig.LOG_DIR / log_file)
        else:
            self._add_stream_hander()

    def _init_formatter(self):
        self.formater = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

    def _add_stream_hander(self):
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setFormatter(self.formater)
        self.log.addHandler(stream_handler)

    def _add_file_hander(self, log_file):
        file_handler = RotatingFileHandler(log_file, maxBytes=1000, backupCount=10)
        file_handler.setFormatter(self.formater)
        self.log.addHandler(file_handler)

    def log_model(self, model_name):
        self.log.info(f"Model: {model_name}")

    def log_response(self, answer, result_calling, process_time):
        self.log.info(f"Answer: {answer} - Function Call Result: {result_calling} {process_time:.2f}s")



