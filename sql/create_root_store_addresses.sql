-- Table: public.root_store_addresses

-- DROP TABLE public.root_store_addresses;

CREATE TABLE public.root_store_addresses
(
    root_store_address VARCHAR(200) NOT NULL, --OrbitDB root store address
    did VARCHAR(64), -- did
    CONSTRAINT root_store_addresses_pkey PRIMARY KEY (did)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.root_store_addresses
  OWNER TO threebox;
