package main

import (
	"fmt"
	"log"
	"os"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/urfave/cli/v2" // imports as package "cli"
)

var isDryRun bool

const (
	branchPrefix string = "Omochice-releaser-"
)

func main() {
	var withV bool
	app := &cli.App{
		Name:  "omochice-releaser",
		Usage: "My hobby releaser tool",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:        "dry-run",
				Aliases:     []string{"d"},
				Usage:       "dry-run mode",
				Destination: &isDryRun,
			},
			&cli.BoolFlag{
				Name:        "with-v",
				Usage:       "v as tag prefix",
				Value:       true,
				Destination: &withV,
			},
		},
		Action: func(*cli.Context) error {
			r, err := git.PlainOpen(".")
			if err != nil {
				return err
			}

			// STEP: check crrent branch is Configure branch
			// is not matched, exit(1 or 0)

			// STEP: if repository is shallowed one, fetch unshallowly

			// STEP: set config usernames

			// STEP: switch branch to {prefix}-{branchName}

			// STEP: rebase current branch onto target branch

			// STEP: push forcely

			origin, err := getOriginURL(r)
			if err != nil {
				return err
			}
			fmt.Printf("origin: %v\n", origin)

			// fetch unshallowed
			err = r.Fetch(&git.FetchOptions{
				RemoteName: "origin",
				Depth:      0,
			})

			// get latest tag
			tags, err := r.Tags()
			if err != nil {
				return err
			}

			// chack if tag is from current branch
			// tagNames = tags.map(r => tagNames.Name().Short())
			latestTag := &plumbing.Reference{}
			tags.ForEach(func(ref *plumbing.Reference) error {
				latestTag = ref
				return nil
			})
			fmt.Printf("boom! I say!: %v, %v, %v\n", isDryRun, withV, latestTag.Name().Short())
			return nil
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}

func getOriginURL(r *git.Repository) (string, error) {
	// Get the "origin" remote from the repository
	origin, err := r.Remote("origin")
	if err != nil {
		log.Fatal(err)
	}

	// Print the URLs of the "origin" remote
	for _, url := range origin.Config().URLs {
		return url, nil
	}
	return "", fmt.Errorf("origin remote not found")
}
