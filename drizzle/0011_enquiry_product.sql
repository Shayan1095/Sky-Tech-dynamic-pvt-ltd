-- Which licensed product a demo was requested for.
--
-- The Products page's "Request a demo" buttons carry ?product=<name>, but it
-- only ever reached the form as prefilled text in the details box. A visitor
-- who rewrote that box sent a demo request that named no product, and the
-- panel had nowhere to show one. This is where it lives now.
--
-- Empty for every enquiry that is not a demo, which is why it defaults to ''
-- rather than being nullable: the rest of this table stores "not given" as an
-- empty string too, and one column disagreeing is a trap for every query
-- written against it later.
ALTER TABLE `enquiries`
  ADD COLUMN `product` VARCHAR(80) NOT NULL DEFAULT '' AFTER `add_ons`;
