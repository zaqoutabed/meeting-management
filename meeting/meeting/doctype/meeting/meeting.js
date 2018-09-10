// Copyright (c) 2018, zaqout and contributors
// For license information, please see license.txt

frappe.ui.form.on('Meeting', {
	send_invitation : function(frm) {
		if (frm.doc.status === "Planned") {
			frappe.call({
				method : "meeting.api.send_invitation_emails",
				args : {
					meeting: frm.doc.name
				}
			});
		}
	},
	refresh : function (frm) {
		//frappe.validated = true;
	}
});

cur_frm.cscript.custom_validate = function(doc) {
	if (doc.date < frappe.datetime.get_today.get_today()) {
		msgprint("You can not select date in past");
		frappe.validated = false;
	}

	if (doc.to_time <= doc.from_time) {
		msgprint("The meeting end before start !");
		frappe.validated = false;
	}
};

frappe.ui.form.on("Meeting Attendees", {
	attendee : function(frm, cdt, cdn) {
		let attendee = frappe.model.get_doc(cdt, cdn);
		console.log(attendee);
		if (attendee.attendee) {
			frappe.call({
				method : "meeting.meeting.doctype.meeting.meeting.get_full_name",
				args : {
					attendee : attendee.attendee
				},
				callback: function(r) {
					frappe.model.set_value(cdt, cdn, "full_name", r.message);
				}
			});

		} else {
			frappe.model.set_value(cdt, cdn, "full_name", null);
		}
 	},
});
