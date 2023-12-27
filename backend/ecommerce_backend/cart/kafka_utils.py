import json
from decimal import Decimal
from kafka import KafkaProducer

def send_order_to_kafka(order_data):
    def json_serializer(data):
        # Custom JSON serializer that handles Decimal types
        def default(obj):
            if isinstance(obj, Decimal):
                return float(obj)  # Convert Decimal to float
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        return json.dumps(data, default=default).encode('utf-8')

    producer = KafkaProducer(
        bootstrap_servers=['kafka:9092'],  # Use the Kafka service name as defined in docker-compose.yml
        value_serializer=json_serializer
    )


    producer.send('Orders', order_data)
    producer.flush()