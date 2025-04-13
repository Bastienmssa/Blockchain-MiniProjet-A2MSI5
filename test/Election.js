const { expect } = require("chai");

describe("Election Contract", function () {
  let Election;
  let election;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Election = await ethers.getContractFactory("Election");
    [owner, addr1, addr2] = await ethers.getSigners();
    election = await Election.deploy();
    await election.waitForDeployment();
  });

  it("Should set the correct owner", async function () {
    expect(await election.owner()).to.equal(owner.address);
  });

  it("Should set the president", async function () {
    await election.connect(owner).setPresident(addr1.address);
    expect(await election.sessionPresident()).to.equal(addr1.address);
  });

  it("Should set the scrutineer", async function () {
    await election.connect(owner).setScrutineer(addr1.address);
    expect(await election.scrutineer()).to.equal(addr1.address);
  });

  it("Should set the secretary", async function () {
    await election.connect(owner).setSecretary(addr1.address);
    expect(await election.secretary()).to.equal(addr1.address);
  });

  it("Should add a resolution", async function () {
    await election.connect(owner).setPresident(addr1.address); // Set addr1 as president to add resolution
    await election.connect(addr1).addResolution("Test Resolution");
    const resolution = await election.resolutions(1);
    expect(resolution.title).to.equal("Test Resolution");
  });

  it("Should vote on a resolution", async function () {
    await election.connect(owner).setPresident(addr1.address); // Set addr1 as president to add resolution
    await election.connect(addr1).addResolution("Test Resolution");
    await election.connect(owner).addToWhitelist([addr2.address]); // Add addr2 to whitelist
    await election.connect(addr2).voteOnResolution(1, "Pour");
    const resolution = await election.resolutions(1);
    expect(resolution.votesFor).to.equal(1);
  });

  it("Should get resolution results", async function () {
    await election.connect(owner).setPresident(addr1.address); // Set addr1 as president to add resolution
    await election.connect(addr1).addResolution("Test Resolution");
    await election.connect(owner).addToWhitelist([addr2.address]); // Add addr2 to whitelist
    await election.connect(addr2).voteOnResolution(1, "Pour");
    await election.connect(owner).setScrutineer(addr1.address); // Set addr1 as scrutineer
    const results = await election.connect(addr1).getResolutionResults(1);
    expect(results[0]).to.equal(1); // votesFor
  });

  it("Should get resolution count", async function () {
    await election.connect(owner).setPresident(addr1.address); // Set addr1 as president to add resolution
    await election.connect(owner).setSecretary(addr1.address); // Set addr1 as secretary
    await election.connect(addr1).addResolution("Test Resolution");
    const count = await election.connect(addr1).getResolutionCount();
    expect(count).to.equal(1);
  });

  it("Should transfer ownership", async function () {
    await election.connect(owner).transferOwnership(addr1.address);
    expect(await election.owner()).to.equal(addr1.address);
  });
});
