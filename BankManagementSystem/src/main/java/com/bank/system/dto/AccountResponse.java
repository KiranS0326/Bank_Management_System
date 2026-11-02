package com.bank.system.dto;

public class AccountResponse {

    private String accountNumber;
    private Double currentBalance;
    private String userName;

    public AccountResponse() {}

    public AccountResponse(String accountNumber, Double currentBalance, String userName) {
        this.accountNumber = accountNumber;
        this.currentBalance = currentBalance;
        this.userName = userName;
    }

    // Getters and Setters
    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Double getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(Double currentBalance) {
        this.currentBalance = currentBalance;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}