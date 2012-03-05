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
  enrollment:
    application_accepted:
      type: String
    parent_visit_tours:
      type: String
    child_interview_process:
      type: String
    parent_interview_process:
      type: String
    dateline_for_applications:
      type: String
    application_fee:
      type: Number
    admission_acceptance_criteria:
      type: String
    notification_occurs:
      type: String
    deposit_required:
      type: Number
    financial_aid:
      type: Boolean
    child_acceptance_criteria:
      type: String
    potty_trained:
      type: Boolean
    child_minimum_age_to_enroll:
      type: String
    kindergartens_attended:
      type: String


InfoSection = mongoose.model("InfoSection", InfoSectionSchema)
exports = module.exports = InfoSection