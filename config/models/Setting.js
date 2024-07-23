const mongoose = require("mongoose");
const MetaDataSchema = require("./schemas/Metadata");
const Schema = mongoose.Schema;
const { singleURLValidator } = require("./validators/URL_Validator");

const SocialMediaSchema = new Schema({
  instagram: {
    profile_url: {
      type: String,
    },
    username: {
      type: String,
    },
  },
});

const ContactSchema = new Schema({
  email: {
    type: String,
  },
  socialmedia: {
    type: [SocialMediaSchema],
  },
});

const AdditionalSchema = new Schema({
  additional: {
    title: String,
    html: String,
  },
});

const SettingSchema = new Schema({
  general: {
    website: {
      details: {
        name: { type: String, default: "Portfolio" },
        domain: { type: String, default: "example.com" },
        favicon: {
          type: Schema.Types.ObjectId,
          ref: "ImageInstance",
          default: null,
        },
      },
      homepage: {
        header: { type: String, default: "A new website!" },
        subheader: { type: String, default: "..." },
        background: {
          type: Schema.Types.ObjectId,
          ref: "ImageInstance",
          default: null,
        },
        metadata: MetaDataSchema,
      },
    },
    dashboard: {
      dark_mode: { type: Boolean, default: false },
    },
    apis: {
      server: {
        api_url: {
          type: String,
          default: "http://example.com/api/",
        },
      },
      youtube: {
        api_key: {
          type: String,
          default: "yout_api_key",
        },
      },
      cld: {
        enable_cld: {
          type: Boolean,
          default: false,
        },
        api_url: {
          type: String,
          default: "https://api.cloudinary.com/v1_1/",
        },
        api_key: {
          type: String,
          default: "your_api_key",
        },
        cloud_name: {
          type: String,
          default: "your_cloud_name",
        },
        preset_name: {
          type: String,
          default: "your_preset_name",
        },
      },
    },
  },
  profile: {
    bio: {
      statement: {
        html: {
          type: String,
          default: "This is a default bio statement.",
        },
      },
      additional: {
        type: [AdditionalSchema],
        default: {
          title: "Default Additional Title",
          html: "<p>Default additional HTML content.</p>",
        },
      },
    },
    portfolio_pdf: {
      enable: {
        type: Boolean,
        default: false,
      },
      url: {
        type: String,
        default: "https://example.com",
        validate: singleURLValidator,
      },
    },
    contact: {
      type: [ContactSchema],
      default: [
        {
          email: "contact@example.com",
          socialmedia: [
            {
              platform: {
                name: { type: String, default: "instagram" },
                profile_url: "https://www.instagram.com/default_profile",
                username: "@default_username",
              },
            },
          ],
        },
      ],
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  modified: Date,
});

const Setting = mongoose.model("Setting", SettingSchema);

module.exports = Setting;
