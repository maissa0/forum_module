package com.forumapp.controller;

import com.forumapp.model.Appointment;
import com.forumapp.service.AppointmentService;
import com.forumapp.model.AppointmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    @Autowired
    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = service.findAll();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = service.findById(id);
        return appointment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            System.out.println("Received appointment request: " + request.getTitle() + ", " + request.getDate() + ", " + request.getTime() + ", " + request.getRole());
            
            Appointment appointment = new Appointment();
            appointment.setTitle(request.getTitle());
            appointment.setDate(request.getDate());
            appointment.setTime(request.getTime());
            appointment.setRole(request.getRole());
            
            System.out.println("Creating appointment with details: " + appointment); // Logging
            System.out.println("Appointment details: Title: " + request.getTitle() + ", Date: " + request.getDate() + ", Time: " + request.getTime() + ", Role: " + request.getRole());
            
            Appointment createdAppointment = service.save(appointment);
            System.out.println("Appointment created successfully: " + createdAppointment.getId());
            return new ResponseEntity<>(createdAppointment, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating appointment: " + e.getMessage()); // Logging error
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment appointment) {
        if (service.findById(id).isPresent()) {
            appointment.setId(id);
            Appointment updatedAppointment = service.save(appointment);
            return new ResponseEntity<>(updatedAppointment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}