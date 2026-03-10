<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Books - Library Management System</title>
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
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid white;
        }
        .btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .header {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h2 {
            color: #333;
        }
        .btn-success {
            background: #28a745;
            color: white;
            border: none;
        }
        .btn-success:hover {
            background: #218838;
        }
        .btn-info {
            background: #17a2b8;
            color: white;
            padding: 5px 15px;
        }
        .btn-info:hover {
            background: #138496;
        }
        .btn-warning {
            background: #ffc107;
            color: #333;
            padding: 5px 15px;
        }
        .btn-warning:hover {
            background: #e0a800;
        }
        .btn-danger {
            background: #dc3545;
            color: white;
            padding: 5px 15px;
        }
        .btn-danger:hover {
            background: #c82333;
        }
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        .table-container {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            color: #333;
            font-weight: 600;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .actions {
            display: flex;
            gap: 5px;
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>Library Management System</h1>
        <div class="user-info">
            <a href="${pageContext.request.contextPath}/home" class="btn btn-primary">Dashboard</a>
            <a href="${pageContext.request.contextPath}/students" class="btn btn-primary">Students</a>
            <span>Welcome, <strong>${username}</strong></span>
            <a href="${pageContext.request.contextPath}/logout" class="btn btn-primary">Logout</a>
        </div>
    </div>
    
    <div class="container">
        <div class="header">
            <h2>Book Management</h2>
            <a href="${pageContext.request.contextPath}/books/new" class="btn btn-success">Add New Book</a>
        </div>
        
        <c:if test="${param.success == 'created'}">
            <div class="alert alert-success">Book created successfully!</div>
        </c:if>
        <c:if test="${param.success == 'updated'}">
            <div class="alert alert-success">Book updated successfully!</div>
        </c:if>
        <c:if test="${param.success == 'deleted'}">
            <div class="alert alert-success">Book deleted successfully!</div>
        </c:if>
        
        <c:if test="${param.error == 'notfound'}">
            <div class="alert alert-error">Book not found!</div>
        </c:if>
        <c:if test="${param.error == 'deletefailed'}">
            <div class="alert alert-error">Failed to delete book!</div>
        </c:if>
        
        <div class="table-container">
            <c:if test="${not empty books}">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="book" items="${books}">
                            <tr>
                                <td>${book.id}</td>
                                <td>${book.title}</td>
                                <td>${book.author}</td>
                                <td>${book.isbn}</td>
                                <td class="actions">
                                    <a href="${pageContext.request.contextPath}/books/view/${book.id}" class="btn btn-info">View</a>
                                    <a href="${pageContext.request.contextPath}/books/edit/${book.id}" class="btn btn-warning">Edit</a>
                                    <a href="${pageContext.request.contextPath}/books/delete/${book.id}" 
                                       class="btn btn-danger"
                                       onclick="return confirm('Are you sure you want to delete this book?')">Delete</a>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </c:if>
            
            <c:if test="${empty books}">
                <div class="empty-state">
                    <p>No books found. Click "Add New Book" to create one.</p>
                </div>
            </c:if>
        </div>
    </div>
</body>
</html>
