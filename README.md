# homebridge-httpswitch
Wake on LAN plugin for homebridge: https://github.com/nfarina/homebridge

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-httpswitch
3. Update your configuration file. See the sample below.

# Configuration

Configuration sample:

 ```
"accessories": [
  {
    "accessory": "HttpSwitch",
    "name": "Projector",
    "onUrl": "http://192.168.0.33:7638/on",
    "offUrl": "http://192.168.0.33:7638/off",
    "statusUrl": "http://192.168.0.33:7638/status",
    "statusOnResponse": "*POW=ON#"
  }
]

```
