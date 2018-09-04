-- Table: public.links

-- DROP TABLE public.links;

CREATE TABLE public.links
(
    address VARCHAR(46) NOT NULL, --ethereum address
    did VARCHAR(64) NOT NULL, -- did,
    consent text,
    CONSTRAINT links_pkey PRIMARY KEY (address)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.links
  OWNER TO root;
