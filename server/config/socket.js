import { Server } from 'socket.io';

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to match your client URL for production security
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
      console.log("Message received:", data);
      // Broadcast the message to the room, excluding the sender
      socket.to(data.room).emit("receive_message", data);

      // Simulate an auto-reply for demo purposes
      if (data.sender === "user") {
        setTimeout(() => {
          const reply = {
            room: data.room,
            text: "Thanks for reaching out! A support agent will be with you shortly.",
            sender: "support",
            timestamp: new Date().toISOString(),
          };
          io.to(data.room).emit("receive_message", reply);
        }, 2000);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  return io;
};

export default configureSocket;
