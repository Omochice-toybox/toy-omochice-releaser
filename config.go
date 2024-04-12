package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/goccy/go-yaml"
)

type Config struct {
	Type    string   `yaml:"type"`
	Targets []Target `yaml:"targets"`
}

type Target struct {
	Branch string `yaml:"branch"`
	PrTo   string `yaml:"prTo"`
	WithV  bool   `yaml:"withV"`
}

func ReadYaml(path string) (Config, error) {
	absPath, err := filepath.Abs(path)
	fmt.Printf("%+v\n", absPath)
	if err != nil {
		return Config{}, err
	}

	b, err := os.ReadFile(absPath)
	if err != nil {
		return Config{}, err
	}

	var config Config
	if err := yaml.Unmarshal(b, &config); err != nil {
		return Config{}, err
	}

	return config, nil
}
