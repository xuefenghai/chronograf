// Package pkg ...
package pkg

import "errors"

func fn() {
	errors.New("a perfectly fine error")
	errors.New("Not a great error")       // MATCH "error strings should not be capitalized"
	errors.New("also not a great error.") // MATCH "error strings should not end with punctuation or a newline"
	errors.New("URL is okay")
	errors.New("SomeFunc is okay")
	errors.New("URL is okay, but the period is not.") // MATCH "error strings should not end with punctuation or a newline"
}

func Write() {
	errors.New("Write: this is broken")
}

type T struct{}

func (T) Read() {
	errors.New("Read: this is broken")
	errors.New("Read failed")
}

func fn2() {
	// The error string hasn't to be in the same function
	errors.New("Read failed")
}