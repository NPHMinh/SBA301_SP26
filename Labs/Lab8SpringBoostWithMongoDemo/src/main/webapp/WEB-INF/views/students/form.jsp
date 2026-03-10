<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><c:if test="${student.id != null}">Edit Student</c:if><c:if test="${student.id == null}">New Student</c:if></title>
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
        .btn-success {
            background: #28a745;
            color: white;
        }
        .btn-success:hover {
            background: #218838;
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
        .form-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .form-container h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }
        input[type="text"],
        input[type="number"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #dc3545;
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
        <div class="form-container">
            <h2><c:if test="${student.id != null}">Edit Student</c:if><c:if test="${student.id == null}">Create New Student</c:if></h2>
            
            <c:if test="${not empty error}">
                <div class="alert-error">
                    ${error}
                </div>
            </c:if>
            
            <%--@elvariable id="student" type=""--%>
            <form:form action="${student.id != null ? pageContext.request.contextPath.concat('/students/update/').concat(student.id) : pageContext.request.contextPath.concat('/students')}" 
                       method="post" 
                       modelAttribute="student">
                
                <div class="form-group">
                    <label for="firstName">First Name: *</label>
                    <form:input path="firstName" id="firstName" required="required" />
                </div>
                
                <div class="form-group">
                    <label for="lastName">Last Name: *</label>
                    <form:input path="lastName" id="lastName" required="required" />
                </div>
                
                <div class="form-group">
                    <label for="marks">Marks: *</label>
                    <form:input path="marks" type="number" id="marks" step="0.01" min="0" max="100" required="required" />
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">
                        <c:if test="${student.id != null}">Update</c:if><c:if test="${student.id == null}">Create</c:if>
                    </button>
                    <a href="${pageContext.request.contextPath}/students" class="btn btn-secondary">Cancel</a>
                </div>
            </form:form>
        </div>
    </div>
</body>
</html>
