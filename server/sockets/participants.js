const participants = new Map(); // socket.id -> { id, name, role }

export const registerParticipantHandlers = (io, socket) => {
  // Join event
  socket.on("participant:join", ({ id, name, role }) => {
    // Prevent duplicates by removing existing socket for the same id
    for (const [sockId, p] of participants.entries()) {
      if (p.id === id) {
        participants.delete(sockId);
        break;
      }
    }

    participants.set(socket.id, { id, name, role });
    emitParticipants(io);
  });

  // Leave event
  socket.on("participant:leave", ({ id }) => {
    for (const [sockId, p] of participants.entries()) {
      if (p.id === id) {
        participants.delete(sockId);
        break;
      }
    }
    emitParticipants(io);
  });

  // Disconnect cleanup
  socket.on("disconnect", () => {
    participants.delete(socket.id);
    emitParticipants(io);
  });

  // Kick user by ID
  socket.on("user:kick", ({ id }) => {
    for (const [sockId, p] of participants.entries()) {
      if (p.id === id) {
        io.to(sockId).emit("user:kicked", { id });
        participants.delete(sockId);
        emitParticipants(io);
        break;
      }
    }
  });
};

export const emitParticipants = (io) => {
  const list = Array.from(participants.values())
    .filter((p) => p.role === "student")
    .map((p) => ({ id: p.id, name: p.name }));
  io.emit("users:update", list);
};
