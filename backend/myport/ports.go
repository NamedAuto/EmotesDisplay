package myport

import (
	"context"
	"fmt"
	"log"
	"net"
	"sync"

	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

var once sync.Once

func CheckPort(db *gorm.DB) {
	log.Println("CHECKING PORT CALLED")
	once.Do(func() {
		var p database.Port
		db.First(&p)
		port := p.Port

		if !isPortInUseOnAllInterfaces(port) {
			fmt.Printf("Port %d is available!\n", port)
		} else {
			fmt.Printf("Port %d is already in use. Searching for another one.\n", port)
			startPort := 49152
			endPort := 65535

			port, err := findAvailablePort(startPort, endPort)
			if err != nil {
				log.Println("Error:", err)
			} else {
				log.Printf("Found available port : %d\n", port)
				p.Port = port
				db.Model(&p).Update("Port", port)
			}
		}
	})
}

// Check all interfaces
func isPortInUseOnAllInterfaces2(port int) bool {
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Println("Error fetching network interfaces:", err)
		return false
	}

	var wg sync.WaitGroup
	results := make(chan bool, len(interfaces))

	for _, iface := range interfaces {
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback == 0 {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		wg.Add(1)
		go func(addresses []net.Addr) {
			defer wg.Done()

			for _, addr := range addresses {
				ip := addr.(*net.IPNet).IP.String()
				conn, err := net.Dial("tcp", fmt.Sprintf("[%s]:%d", ip, port))
				if err == nil {
					conn.Close()
					results <- true
					return
				}
			}
		}(addrs)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	for result := range results {
		if result {
			log.Println("Port is in use")
			return true
		}
	}

	return false
}

// return immedieately on true
func isPortInUseOnAllInterfaces(port int) bool {
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Println("Error fetching network interfaces:", err)
		return false
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var wg sync.WaitGroup
	results := make(chan bool)

	for _, iface := range interfaces {
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback == 0 {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		wg.Add(1)
		go func(ctx context.Context, addresses []net.Addr) {
			defer wg.Done()
			for _, addr := range addresses {
				select {
				case <-ctx.Done():
					return
				default:
					ip := addr.(*net.IPNet).IP.String()
					conn, err := net.Dial("tcp", fmt.Sprintf("[%s]:%d", ip, port))
					if err == nil {
						conn.Close()
						results <- true
						cancel()
						return
					}
				}
			}
		}(ctx, addrs)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	for result := range results {
		if result {
			log.Println("Port is in use")
			return true
		}
	}

	return false
}

func findAvailablePort(startPort, endPort int) (int, error) {
	for port := startPort; port <= endPort; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available port found in the range %d-%d", startPort, endPort)
}
