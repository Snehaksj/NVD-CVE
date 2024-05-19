import mongoose from "mongoose";

const DescriptionSchema = new mongoose.Schema({
  lang: String,
  value: String,
});

const CvssMetricV2Schema = new mongoose.Schema({
  source: String,
  type: String,
  cvssData: {
    version: String,
    vectorString: String,
    accessVector: String,
    accessComplexity: String,
    authentication: String,
    confidentialityImpact: String,
    integrityImpact: String,
    availabilityImpact: String,
    baseScore: Number,
  },
  baseSeverity: String,
  exploitabilityScore: Number,
  impactScore: Number,
  acInsufInfo: Boolean,
  obtainAllPrivilege: Boolean,
  obtainUserPrivilege: Boolean,
  obtainOtherPrivilege: Boolean,
  userInteractionRequired: Boolean,
});

const WeaknessSchema = new mongoose.Schema({
  source: String,
  type: String,
  description: [DescriptionSchema],
});

const ConfigurationSchema = new mongoose.Schema({
  operator: String,
  nodes: [
    {
      operator: String,
      negate: Boolean,
      cpeMatch: [
        {
          vulnerable: Boolean,
          criteria: String,
          matchCriteriaId: String,
        },
      ],
    },
  ],
});

const ReferenceSchema = new mongoose.Schema({
  url: String,
  source: String,
  tags: [String],
});

const CveSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  sourceIdentifier: String,
  published: Date,
  lastModified: Date,
  vulnStatus: String,
  descriptions: [DescriptionSchema],
  metrics: {
    cvssMetricV2: [CvssMetricV2Schema],
  },
  weaknesses: [WeaknessSchema],
  configurations: [ConfigurationSchema],
  references: [ReferenceSchema],
});

const CVE = mongoose.model("CVE", CveSchema);
export default CVE;
