package com.fu.edu.Lab6.services;

import com.fu.edu.Lab6.dto.UserResponse;
import com.fu.edu.Lab6.entity.User;
import com.fu.edu.Lab6.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        testUser1 = User.builder()
                .id(1L)
                .fullName("User One")
                .email("user1@example.com")
                .password("password123")
                .role("USER")
                .build();

        testUser2 = User.builder()
                .id(2L)
                .fullName("User Two")
                .email("user2@example.com")
                .password("password456")
                .role("ADMIN")
                .build();
    }

    @Test
    @DisplayName("Should get user by email successfully")
    void shouldGetUserByEmailSuccessfully() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser1));

        // When
        UserResponse response = userService.getUserByEmail("user1@example.com");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getFullName()).isEqualTo("User One");
        assertThat(response.getEmail()).isEqualTo("user1@example.com");
        assertThat(response.getRole()).isEqualTo("USER");

        verify(userRepository).findByEmail("user1@example.com");
    }

    @Test
    @DisplayName("Should throw exception when user not found by email")
    void shouldThrowExceptionWhenUserNotFoundByEmail() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.getUserByEmail("notfound@example.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");

        verify(userRepository).findByEmail("notfound@example.com");
    }

    @Test
    @DisplayName("Should get all users successfully")
    void shouldGetAllUsersSuccessfully() {
        // Given
        List<User> users = Arrays.asList(testUser1, testUser2);
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<UserResponse> responses = userService.getAllUsers();

        // Then
        assertThat(responses).isNotNull();
        assertThat(responses).hasSize(2);

        assertThat(responses.get(0).getEmail()).isEqualTo("user1@example.com");
        assertThat(responses.get(0).getFullName()).isEqualTo("User One");

        assertThat(responses.get(1).getEmail()).isEqualTo("user2@example.com");
        assertThat(responses.get(1).getRole()).isEqualTo("ADMIN");

        verify(userRepository).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no users exist")
    void shouldReturnEmptyListWhenNoUsers() {
        // Given
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<UserResponse> responses = userService.getAllUsers();

        // Then
        assertThat(responses).isNotNull();
        assertThat(responses).isEmpty();

        verify(userRepository).findAll();
    }
}
