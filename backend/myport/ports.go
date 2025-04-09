package myport

import (
	"fmt"
	"net"
)

func IsPortAvailable(port int) bool {
	ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return false
	}
	ln.Close()
	return true
}

// func isPortInUse(port int) bool {
//     cmd := exec.Command("lsof", "-i", fmt.Sprintf(":%d", port))
//     output, err := cmd.Output()
//     if err != nil {
//         return false
//     }
//     return strings.Contains(string(output), fmt.Sprintf(":%d", port))
// }

func FindAvailablePort(startPort, endPort int) (int, error) {
	for port := startPort; port <= endPort; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available port found in the range %d-%d", startPort, endPort)
}
