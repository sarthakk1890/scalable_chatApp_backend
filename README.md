# Highly Scalable chatApp backend

## Architecture Overview

The backend system is designed with scalability, reliability, and efficiency in mind. It leverages a combination of real-time communication protocols, message brokers, and databases to ensure seamless message delivery and data management across distributed servers. The architecture is capable of handling high traffic while maintaining consistent message distribution across multiple users.

## Key Components

### 1. **Socket.io Servers**
   - **Description**: Socket.io servers manage real-time connections between users and the application. Each server instance can handle numerous concurrent connections.
   - **Functionality**: It listens for incoming messages, events, and notifications from connected users, which are then emitted to relevant users or broadcasted to all connected clients.

### 2. **Redis Pub/Sub**
   - **Description**: Redis acts as a publish/subscribe broker, enabling efficient communication between distributed server instances.
   - **Functionality**: Each Socket.io server subscribes to Redis channels to receive updates. Messages published to these channels are propagated to all subscribers, ensuring synchronized state across servers.

### 3. **Kafka (Aiven)**
   - **Description**: Kafka is used as the primary message streaming platform, responsible for queuing messages during high-traffic periods.
   - **Functionality**: Kafka buffers messages, allowing them to be processed in a reliable, fault-tolerant manner. This ensures that no messages are lost, even when there is a surge in traffic.

### 4. **PostgreSQL (Aiven)**
   - **Description**: PostgreSQL serves as the main database for storing persistent data, such as user information, chat histories, and logs.
   - **Functionality**: Messages and events processed by Kafka consumers are written to PostgreSQL, ensuring a reliable record of all communication.

### 5. **Consumer Service**
   - **Description**: The consumer service is responsible for reading messages from Kafka and processing them.
   - **Functionality**: The service listens to the Kafka topic, processes each message, and writes it to PostgreSQL for permanent storage. This decouples the message-handling workload from the Socket.io servers, improving scalability.

## Message Flow

1. **User Events**: When a user sends a message or triggers an event, it is captured by the connected Socket.io server.
2. **Redis Pub/Sub**: The server publishes the message to a Redis channel, which distributes it to all subscribed Socket.io servers.
3. **Kafka Stream**: Messages are then sent to Kafka, acting as a message buffer and ensuring delivery during high traffic.
4. **Consumer Service**: A consumer reads the messages from Kafka and writes them to PostgreSQL for permanent storage.

## System Diagram

Below is a visual representation of the backend architecture:

                        +---------------------------+
                        |       Event Emit          |
                        |   MESSAGE: hello          |
                        +---------------------------+
                                   |
                                   v
                         +------------------+
                         |    Redis - Aiven |       
                         |  (Pub/Sub Broker)|
                         +------------------+
                             /           \
                            /             \
               +------------------+    +------------------+
               |   Server 1       |    |   Server 2       |
               |   (Socket.io)    |    |   (Socket.io)    |
               +------------------+    +------------------+
                      |                         |
                     /|\                       /|\
                +------+-----+          +-------+-----+
                |            |          |             |
             +------+     +------+    +------+     +------+
             | User 1|    | User 2|   | User 3|   | User 4|
             +------+     +------+    +------+     +------+
                      |                         |
                      |                         |
               +------------------+    +------------------+
               |     Kafka        |    |     Kafka       |
               |    (Message      |    |    Queue)       |
               +------------------+    +------------------+
                                   |
                                   v
                       +-------------------------+
                       |     Consumer Service    |
                       |       (Node.js)         |
                       +-------------------------+
                                   |
                                   v
                       +-------------------------+
                       |   PostgreSQL Database   |
                       |    (Persistent Storage) |
                       +-------------------------+


# Technologies Used

This project utilizes a variety of technologies to achieve scalability, reliability, and real-time functionality. Below is a summary of the main technologies used:

| Technology    | Purpose                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Socket.io** | Manages real-time WebSocket connections with clients.                   |
| **Redis**     | Acts as a Pub/Sub message broker to synchronize data across multiple server instances. |
| **Kafka**     | Used as a message queue to handle high volumes of data and ensure reliable message processing. |
| **PostgreSQL**| Provides a reliable relational database for storing user data and chat history. |
| **Node.js**   | The backend runtime environment to build scalable, asynchronous services. |
| **Aiven**     | Hosted Redis and Kafka services, offering managed solutions for Redis and Kafka. |

Each of these components plays a key role in ensuring that the backend can handle a large number of simultaneous connections, distribute messages across distributed servers, and persistently store all chat history.

---

This architecture allows the backend to be highly scalable and maintain seamless communication across multiple server instances, ensuring reliable message delivery in a real-time chat environment.
