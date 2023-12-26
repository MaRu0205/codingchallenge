from kafka import KafkaProducer
import json

def send_order_to_kafka(order_data):
    producer = KafkaProducer(
        bootstrap_servers=['0.0.0.0:9092'],  # Replace with your Kafka server address
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )

    producer.send('Orders', order_data)
    producer.flush()
