InfoSectionSchema = new Schema
  user_id:
    type: String
  general_information:
    school_philosophy:
      type: String
    general_aproach_to_learning:
      type: [String]
    licensed:
      type: Boolean
    speaking_classes:
      type: [Number]
    open_door_policy:
      type: Boolean
    learning_philosophy_and_tools_language:
      type: [String]
    learning_philosophy_and_tools_cognitive_dev:
      type: [String]
    home_school_connections:
      type: [String]
    home_school_separations:
      type: [String]
    certificates:
      type: [String]
  environment:
    indoors:
      type: [String]
    outdoors:
      type: [String]
    for_infants:
      type: [String]
    health_and_safety_issues:
      type: [String]
    transportation_policies:
      type: [String]

InfoSection = mongoose.model("InfoSection", InfoSectionSchema)
exports = module.exports = InfoSection