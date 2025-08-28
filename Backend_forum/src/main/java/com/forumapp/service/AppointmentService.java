package com.forumapp.service;

import com.forumapp.model.Appointment;
import com.forumapp.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    @Autowired
    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public List<Appointment> findAll() {
        return repository.findAll();
    }

    public Optional<Appointment> findById(String id) {
        return repository.findById(id);
    }

    public Appointment save(Appointment appointment) {
        System.out.println("Saving appointment: " + appointment); // Logging
        return repository.save(appointment);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

    // Additional methods for better API support
    public Appointment update(String id, Appointment appointment) {
        if (repository.existsById(id)) {
            appointment.setId(id);
            return repository.save(appointment);
        }
        return null;
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public List<Appointment> findByRole(String role) {
        // This would need to be implemented in the repository if needed
        return repository.findAll().stream()
                .filter(appointment -> role.equals(appointment.getRole()))
                .toList();
    }
}