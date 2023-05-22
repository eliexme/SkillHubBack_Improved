const Event = require("../models/Event.model");
const Skill = require("../models/Skill.model")
const router = require("express").Router();


router.get("/", (req, res, next) => {
  res.json("Event good in here");
});

// POST  to add one Event
router.post("/create", async (req, res) => {
  
  try {
    const payload = req.body;
    console.log("Payload:", payload)
    const newEvent = await Event.create(payload);
    const addedEvent = await Skill.findByIdAndUpdate(payload.skillid, { $push: { events: payload }}, { new: true })
    res.status(201).json(newEvent);
  } catch (error) {
    console.log(error);
  }
});

//GET event details
router.get("/eventdets/:eventId", async (req, res) => {
    
  try {
    const eventId = req.params.eventId
    const eventDetails = await Event.findById(eventId )
    const { _id, title, description, date, locationType } = eventDetails;
    const formattedDate = date.toISOString().slice(0, 10)
    const formattedEventDetails = {
      _id,
      title,
      description,
      date: formattedDate,
      locationType,
    }
    res.status(200).json(formattedEventDetails)
      
  } catch (error) {
    console.log(error);
  }
})

// POST edit event
router.put ("/updateevent/:eventId", async (req, res) => {

  try {
    const eventId = req.params.eventId
    const updateDataEvent = req.body
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
       title: updateDataEvent.title,
       description: updateDataEvent.description,
       date: updateDataEvent.date,
       locationType: updateDataEvent.locationType,

      }, {new:true})
      res.status(200).json(updatedEvent)
  } catch (error) {
    console.log(error)
  }

})

router.delete ("/deleteevent/:eventId", async (req, res) => {
  try{
    const eventId = req.params.eventId

    await Event.findByIdAndDelete(eventId)
    res.status(200).json({message: "Event deleted"})
  } catch (error) {
    console.log(error)
}})
module.exports = router;