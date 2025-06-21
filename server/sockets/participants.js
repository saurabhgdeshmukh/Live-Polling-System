const participants = new Map(); 

export const registerParticipantHandlers = (io, socket) => {

  socket.on("participant:join", ({ id, name, role }) => {
  
    for (const [sockId, p] of participants.entries()) {
      if (p.id === id) {
        participants.delete(sockId);
        break;
      }
    }

    participants.set(socket.id, { id, name, role });
    emitParticipants(io);
  });

  socket.on("participant:leave", ({ id }) => {
    for (const [sockId, p] of participants.entries()) {
      if (p.id === id) {
        participants.delete(sockId);
        break;
      }
    }
    emitParticipants(io);
  });

  socket.on("disconnect", () => {
    participants.delete(socket.id);
    emitParticipants(io);
  });

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
