import "../App.css";
import { Grid } from "@mui/material";
import GenericButton from "../components/GenericButton";

export default function DestinationPage() {
  return (
    <div class="grid-container">
      <div class="grid-item">Input or address</div>
      <div class="grid-item">
        <form type="text">
          <input placeholder="Enter destination"></input>
        </form>
      </div>
      <div class="grid-item">
        <GenericButton
          href={"http://localhost:3000/selection"}
          id="GenPL"
          text={"New Playlist"}
        />
        {/* <button href={"http://localhost:3000/selection"} id="GenPL">
          NEW PLAYLIST
        </button> */}
      </div>
    </div>
  );
}

//   .Input-place {
//     border-radius: 10px;
//     width: 300px;
//     height: 50px;
//     font-size: 25px;
//     font-family: Arial;
//     letter-spacing: .15rem;
//     text-indent: 10px;
//   }

// This sample uses the Places Autocomplete widget to:
// 1. Help the user select a place
// 2. Retrieve the address components associated with that place
// 3. Populate the form fields with those address components.
// This sample requires the Places library, Maps JavaScript API.
// Include the libraries=places parameter when you first load the API.
// For example: <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let autocomplete;
let address1Field;
let address2Field;
let postalField;

function initAutocomplete() {
  address1Field = document.querySelector("#ship-address");
  address2Field = document.querySelector("#address2");
  postalField = document.querySelector("#postcode");
  // Create the autocomplete object, restricting the search predictions to
  // addresses in the US and Canada.
  // autocomplete = new google.maps.places.Autocomplete(address1Field, {
  //   componentRestrictions: { country: ["us", "ca"] },
  //   fields: ["address_components", "geometry"],
  //   types: ["address"],
  // });
  address1Field.focus();
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address1 = "";
  let postcode = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        document.querySelector("#locality").value = component.long_name;
        break;
      case "administrative_area_level_1": {
        document.querySelector("#state").value = component.short_name;
        break;
      }
      case "country":
        document.querySelector("#country").value = component.long_name;
        break;
    }
  }

  address1Field.value = address1;
  postalField.value = postcode;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2Field.focus();
}

window.initAutocomplete = initAutocomplete;
