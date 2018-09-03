-- Table: public.hashes

-- DROP TABLE public.hashes;

CREATE TABLE public.hashes
(
    hash VARCHAR(46) NOT NULL, --IPFS hash
    did VARCHAR(64), -- did
    CONSTRAINT hashes_pkey PRIMARY KEY (did)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.hashes
  OWNER TO root;
