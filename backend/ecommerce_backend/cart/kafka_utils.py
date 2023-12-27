from kafka import KafkaProducer
import json

def send_order_to_kafka(order_data):
    producer = KafkaProducer(
        bootstrap_servers=['kafka:9092'],  # Use Kafka service name of docker-compose.yml
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )


    producer.send('Orders', order_data)
    producer.flush()
