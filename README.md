# TCP Relay Utility (TRU)

TRU provides 1 client -> 1 host connections via a shared id with proxying for non-local connections.

A public signalling/relay server is available at `198.251.89.45`; self-hosting is of course also an option.

## Implementations

&nbsp; | [Pluto](https://pluto-lang.org) | JavaScript | C++
-------|---------------------------------|------------|----
Client | Not planned | [tru-client.js](tru-client.js) | Not planned
Host | [tru-host.pluto](tru-host.pluto) | Not planned | TODO
Relay | [tru-relay.pluto](tru-relay.pluto) | Not planned | Not planned

## Protocol

Connections to the TRU relay use WebSocket on port 7987. TLS, upgrade request, and masking are optional. LAN connections use the same convention.

TRU operates on IP addresses alone so assumes a trustworthy routing system. Some web clients may have "secure contexts" tho requiring the use of TLS. For this, IP addresses can be translated to a [faketls](http://faketls.com) hostname.

The exact mechanism by which the host and client arrive at the same id is not specified, but one possible scenario is the host generating a random id and then sharing an invite, which itself can contain LAN IPs and port, allowing the relay connection to become optional.

After connecting to TRU Relay:
- Send `h <id> <port> <lan ips>` to initiate a connection as the host.
	- `port` is the port bound for incoming LAN connections; it can be random or application-defined.
	- Multiple LAN IPs are comma-separated.
	- If it is not feasable to determine LAN IPs, provide 127.0.0.1 instead.
- Send `c <id>` to initiate a connection as the client

Messages from TRU Relay:
- `wait` means initiate succeeded on this end and we're now waiting for the other party to initiate
- `try <port> <lan ips>` is sent to the client after both sides have initiated
	- The client should now contact all given LAN IPs on the given port by establishing a WebSocket connection and sending the id. If the id is echoed back, the connection succeeds.
	- The first LAN connection that succeeds is used. If all failed or 100 ms have passed, send `relay`.
- `relay` is sent to both parties to indicate that the signalling connection has become a relay connection and transitions to the application protocol.
