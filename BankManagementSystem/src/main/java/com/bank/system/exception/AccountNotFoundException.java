package com.bank.system.exception;

@SuppressWarnings("serial")
public class AccountNotFoundException extends RuntimeException {
    
    public AccountNotFoundException(String message) {
        super(message);
    }
}