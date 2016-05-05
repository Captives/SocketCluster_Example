SocketCluster Sample App
==========
<img src="https://avatars2.githubusercontent.com/u/16425764?v=3&s=460"/>

<h4>Close descriptions</h4>
```
    1000: 'Normal connection closure',
    1001: 'Remote peer is going away',
    1002: 'Protocol error',
    1003: 'Unprocessable input',
    1004: 'Reserved',
    1005: 'Reason not provided',
    1006: 'Abnormal closure, no further detail available',
    1007: 'Invalid data received',
    1008: 'Policy violation',
    1009: 'Message too big',
    1010: 'Extension requested by client is required',
    1011: 'Internal Server Error',
    1015: 'TLS Handshake Failed'
```

<h4>Socket Protocol Error Statuses</h4>
```
    1001: 'Socket was disconnected',
    1002: 'A WebSocket protocol error was encountered',
    1003: 'Server terminated socket because it received invalid data',
    1005: 'Socket closed without status code',
    1006: 'Socket hung up',
    1007: 'Message format was incorrect',
    1008: 'Encountered a policy violation',
    1009: 'Message was too big to process',
    1010: 'Client ended the connection because the server did not comply with extension requirements',
    1011: 'Server encountered an unexpected fatal condition',
    4000: 'Server ping timed out',
    4001: 'Client pong timed out',
    4002: 'Server failed to sign auth token',
    4003: 'Failed to complete handshake',
    4004: 'Client failed to save auth token',
    4005: 'Did not receive #handshake from client before timeout',
    4006: 'Failed to bind socket to message broker',
    4007: 'Client connection establishment timed out'
```