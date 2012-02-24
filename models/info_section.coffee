InfoSectionSchema = new Schema
  user_id:
    type: String
  general_information:
    school_philosophy:
      type: String
    general_aprocah_to_learning:
      type: [Number]
    licensed:
      type: Boolean
    speaking_classes:
      type: [Number]
    open_door_policy:
      type: Boolean
    learning_philosophy_and_tools_language:
      type: [Number]
    learning_philosophy_and_tools_cognitive_dev:
      type: [Number]
    home_school_connections:
      type: [Number]
    home_school_separations:
      type: [Number]
    certificates:
      type: [Number]
  environment:
    indoors:
      type: [Number]
    outdoors:
      type: [Number]
    for_infants:
      type: [Number]
    health_and_safety_issues:
      type: [Number]
    transportation_policies:
      type: [Number]

InfoSection = mongoose.model("InfoSection", InfoSectionSchema)
exports = module.exports = InfoSection