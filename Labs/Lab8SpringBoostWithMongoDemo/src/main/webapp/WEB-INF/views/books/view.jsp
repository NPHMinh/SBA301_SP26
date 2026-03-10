<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Book - Library Management System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
        }
        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .navbar h1 {
            font-size: 24px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .btn {
            padding: 8px 20px;
            border-radius: 5px;
            text-decoration: none;
            transition: all 0.3s;
            display: inline-block;
        }
        .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid white;
        }
        .btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .btn-warning {
            background: #ffc107;
            color: #333;
        }
        .btn-warning:hover {
            background: #e0a800;
        }
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        .btn-secondary:hover {
            background: #5a6268;
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .detail-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .detail-container h2 {
            color: #333;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #667eea;
        }
        .detail-row {
            display: flex;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #555;
            width: 200px;
        }
        .detail-value {
            color: #333;
            flex: 1;
        }
        .actions {
            margin-top: 30px;
            display: flex;
            gap: 10px;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>Library Management System</h1>
        <div class="user-info">
            <a href="${pageContext.request.contextPath}/home" class="btn btn-primary">Dashboard</a>
            <a href="${pageContext.request.contextPath}/books" class="btn btn-primary">Books</a>
            <span>Welcome, <strong>${username}</strong></span>
            <a href="${pageContext.request.contextPath}/logout" class="btn btn-primary">Logout</a>
        </div>
    </div>
    
    <div class="container">
        <div class="detail-container">
            <h2>Book Details</h2>
            
            <div class="detail-row">
                <div class="detail-label">Book ID:</div>
                <div class="detail-value">${book.id}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label">Title:</div>
                <div class="detail-value">${book.title}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label">Author:</div>
                <div class="detail-value">${book.author}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label">ISBN:</div>
                <div class="detail-value">${book.isbn}</div>
            </div>
            
            <div class="actions">
                <a href="${pageContext.request.contextPath}/books/edit/${book.id}" class="btn btn-warning">Edit Book</a>
                <a href="${pageContext.request.contextPath}/books" class="btn btn-secondary">Back to List</a>
            </div>
        </div>
    </div>
</body>
</html>
